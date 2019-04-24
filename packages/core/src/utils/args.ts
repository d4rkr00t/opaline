export function isVersion(argv: Array<string>) {
  return argv.find(f => f === "-v") || argv.find(f => f === "--version");
}

export function isHelp(argv: Array<string>) {
  return argv.find(f => f === "--help");
}
