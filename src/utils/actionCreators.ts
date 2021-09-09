const functions: Function[] = [];
const functionNames: string[] = [];

type SimpleActionCreator = Function & {
	typePrefix?: string;
};

type FuncMap = Record<string, SimpleActionCreator>;

export const addActionCreators = (funcMap: FuncMap) => {
	Object.entries(funcMap).map(([funcName, func]) => {
		const resultFuncName = func.typePrefix || funcName;

		functionNames.push(resultFuncName);
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
