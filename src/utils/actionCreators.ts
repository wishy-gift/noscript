const functions: Function[] = [];
const functionNames: string[] = [];

type FuncMap = Record<string, Function>;

export const addActionCreators = (funcMap: FuncMap) => {
	Object.entries(funcMap).map(([funcName, func]) => {
		functionNames.push(funcName);
		functions.push(func);
	});
};

export const getActionCreator = (func: string) => {
	const funcIndex = functionNames.indexOf(func);

	return functions[funcIndex];
};

export const getActionCreatorName = (func: Function) => {
	const funcIndex = functions.indexOf(func);

	return functionNames[funcIndex];
};
