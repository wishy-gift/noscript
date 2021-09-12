const functions: Function[] = [];
const functionNames: string[] = [];

type SimpleActionCreator = Function & {
	typePrefix?: string;
};

type FuncMap = Record<string, SimpleActionCreator>;

export const addActionCreators = (funcMap: FuncMap) => {
	for (const [funcName, func] of Object.entries(funcMap)) {
		const resultFuncName = func.typePrefix || funcName;

		functionNames.push(resultFuncName);
		functions.push(func);
	}
};

export const getActionCreator = (funcName: string) => {
	const funcIndex = functionNames.indexOf(funcName);

	return functions[funcIndex];
};

export const getActionCreatorName = (func: Function) => {
	const funcIndex = functions.indexOf(func);

	return functionNames[funcIndex];
};
