export interface NestedPrintableOutput extends Array<PrintableOutput> {}
export type PrintableOutput = string | Array<string | NestedPrintableOutput>;

export function indent(text: string, level: number = 1) {
  return `${("" as any).padStart(level * 2, " ")}${text}`;
}

export function print(text: PrintableOutput, level: number = 1) {
  if (Array.isArray(text)) {
    text.forEach(item => {
      if (Array.isArray(item)) {
        print(item, level + 1);
      } else {
        console.log(indent(item, level));
      }
    });
  } else {
    console.log(indent(text, level));
  }
}
