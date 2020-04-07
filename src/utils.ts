const tryParseJson = (v: string): any => {
  try { return JSON.parse(v); } catch { return v; }
}

const getExpressionOperator = (operators: string[]) =>
(exp: string): string => {
  const ops = [...operators].sort((a, b) => b.length - a.length);
  const result = ops.find((op) => exp.includes(op))
  return result;
}

export const parseExpression = (operators: string[]) =>
  (exp: string): [string, string, string] => {
    const op = getExpressionOperator(operators)(exp);
    const chunks = exp.split(op);
    const field = decodeURIComponent(chunks[0]);
    let value = decodeURIComponent(chunks[1]);
    value = tryParseJson(value);

    return [field, op, value];
  }
