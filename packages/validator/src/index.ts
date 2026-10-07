export type ValidationStatus = "passed" | "failed";

export interface ProjectFile {
  path: string;
  content: string;
}

export interface ValidationDiagnostic {
  code: string;
  message: string;
  path?: string;
  severity: "error" | "warning";
}

export interface ValidationResult {
  status: ValidationStatus;
  diagnostics: ValidationDiagnostic[];
  checks: string[];
}

export interface BuildExecutionResult {
  exitCode: number;
  stdout?: string;
  stderr?: string;
}

export interface BuildExecutor {
  installAndBuild(files: ProjectFile[]): Promise<BuildExecutionResult>;
}

const REQUIRED_FILES = [
  "package.json",
  "index.html",
  "vite.config.ts",
  "src/main.tsx"
];

export function validateProjectStructure(files: ProjectFile[]): ValidationResult {
  const diagnostics: ValidationDiagnostic[] = [];
  const checks: string[] = [];
  const paths = new Set(files.map((file) => file.path));

  for (const required of REQUIRED_FILES) {
    if (paths.has(required)) {
      checks.push(`required-file:${required}`);
    } else {
      diagnostics.push({
        code: "MISSING_REQUIRED_FILE",
        message: `Required file is missing: ${required}`,
        path: required,
        severity: "error"
      });
    }
  }

  const packageFile = files.find((file) => file.path === "package.json");
  if (packageFile) {
    try {
      const pkg = JSON.parse(packageFile.content) as {
        scripts?: Record<string, unknown>;
        dependencies?: Record<string, unknown>;
      };

      if (pkg.scripts?.build) checks.push("package-script:build");
      else {
        diagnostics.push({
          code: "MISSING_BUILD_SCRIPT",
          message: "package.json does not define a build script.",
          path: "package.json",
          severity: "error"
        });
      }

      if (pkg.scripts?.dev) checks.push("package-script:dev");
      else {
        diagnostics.push({
          code: "MISSING_DEV_SCRIPT",
          message: "package.json does not define a dev script.",
          path: "package.json",
          severity: "warning"
        });
      }

      if (!pkg.dependencies?.react) {
        diagnostics.push({
          code: "MISSING_REACT_DEPENDENCY",
          message: "React is not declared in dependencies.",
          path: "package.json",
          severity: "error"
        });
      }
    } catch {
      diagnostics.push({
        code: "INVALID_PACKAGE_JSON",
        message: "package.json is not valid JSON.",
        path: "package.json",
        severity: "error"
      });
    }
  }

  const hasApp = [...paths].some(
    (path) => path === "src/App.tsx" || path === "src/App.jsx"
  );

  if (hasApp) checks.push("entry-component");
  else {
    diagnostics.push({
      code: "MISSING_APP_COMPONENT",
      message: "No src/App.tsx or src/App.jsx entry component was found.",
      severity: "error"
    });
  }

  return {
    status: diagnostics.some((item) => item.severity === "error")
      ? "failed"
      : "passed",
    diagnostics,
    checks
  };
}

export async function validateProject(
  files: ProjectFile[],
  executor?: BuildExecutor
): Promise<ValidationResult> {
  const structural = validateProjectStructure(files);

  if (structural.status === "failed" || !executor) {
    return structural;
  }

  const execution = await executor.installAndBuild(files);

  if (execution.exitCode !== 0) {
    return {
      ...structural,
      status: "failed",
      diagnostics: [
        ...structural.diagnostics,
        {
          code: "BUILD_FAILED",
          message: execution.stderr?.trim() || "Generated project failed to build.",
          severity: "error"
        }
      ],
      checks: [...structural.checks, "build:failed"]
    };
  }

  return {
    ...structural,
    checks: [...structural.checks, "build:passed"]
  };
}
