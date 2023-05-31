import { access, readdir } from "node:fs/promises";
import path, { basename } from "node:path";

export const NODE_MODULES_DIR = "node_modules";

const EXTENSION_RE =
  // eslint-disable-next-line regexp/no-unused-capturing-group
  /^@(\w+)\/unml-extension(?:-([-\w]+))?$|^unml-extension-([-\w]+)$/;
const PLAIN_PACKAGE_RE = /^[a-z\d][._\-a-z\d]*$/;

async function loadModulesFromDir(dirname: string) {
  const dirs = await readdir(dirname);
  const scope = basename(dirname);
  const validDirs = dirs.filter((name) =>
    EXTENSION_RE.test(`${scope}/${name}`),
  );

  return validDirs.map((name) => `${scope}/${name}`);
}

export async function loadExtensionsFromCwd(cwd = process.cwd()) {
  const dirs = await readdir(path.join(cwd, NODE_MODULES_DIR));
  const scopedModules = [];
  for (const scopedDir of dirs.filter((name) => name.startsWith("@"))) {
    scopedModules.push(
      ...(await loadModulesFromDir(
        path.join(cwd, NODE_MODULES_DIR, scopedDir),
      )),
    );
  }
  const flattenDirs = [
    ...dirs.filter((name) => PLAIN_PACKAGE_RE.test(name)),
    ...scopedModules,
  ];

  return flattenDirs.filter((name) => EXTENSION_RE.test(name));
}

export const exists = (d: string) =>
  access(d).then(
    () => true,
    () => false,
  );

if (import.meta.vitest) {
  const { expect, it } = import.meta.vitest;
  it("utils", () => {
    expect(EXTENSION_RE.test("@scope/unml-extension-name")).toBe(true);
    expect(EXTENSION_RE.test("@scope/unml-extension")).toBe(true);
    expect(EXTENSION_RE.test("@scope/unml-extension-name-1")).toBe(true);
    expect(EXTENSION_RE.test("unml-extension-name")).toBe(true);
    expect(EXTENSION_RE.test("unml-extension")).toBe(false);
  });
}