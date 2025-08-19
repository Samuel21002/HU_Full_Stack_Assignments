import Header from "./components/header";
import Total from "./components/total";
import Content from "./components/content";

interface CoursePartBase {
	name: string;
	exerciseCount: number;
}

interface CoursePartWithDescription extends CoursePartBase {
	description: string;
}

export interface CoursePartBasic extends CoursePartWithDescription {
	kind: "basic";
}

export interface CoursePartGroup extends CoursePartBase {
	groupProjectCount: number;
	kind: "group";
}

export interface CoursePartBackground extends CoursePartWithDescription {
	backgroundMaterial: string;
	kind: "background";
}

export interface CourseTypeSpecial extends CoursePartWithDescription {
	requirements: Array<string>;
	kind: "special";
}

export type CoursePart =
	| CoursePartBasic
	| CoursePartGroup
	| CoursePartBackground
	| CourseTypeSpecial;

const App = () => {
	// const-declarations
	const courseName = "Half Stack application development";

	const courseParts: CoursePart[] = [
		{
			name: "Fundamentals",
			exerciseCount: 10,
			description: "This is an awesome course part",
			kind: "basic",
		},
		{
			name: "Using props to pass data",
			exerciseCount: 7,
			groupProjectCount: 3,
			kind: "group",
		},
		{
			name: "Basics of type Narrowing",
			exerciseCount: 7,
			description: "How to go from unknown to string",
			kind: "basic",
		},
		{
			name: "Deeper type usage",
			exerciseCount: 14,
			description: "Confusing description",
			backgroundMaterial:
				"https://type-level-typescript.com/template-literal-types",
			kind: "background",
		},
		{
			name: "TypeScript in frontend",
			exerciseCount: 10,
			description: "a hard part",
			kind: "basic",
		},
		{
			name: "Backend development",
			exerciseCount: 21,
			description: "Typing the backend",
			requirements: ["nodejs", "jest"],
			kind: "special",
		},
	];

	const totalExercises = courseParts.reduce(
		(sum, part) => sum + part.exerciseCount,
		0
	);

	return (
		<div>
			<Header name={courseName} />
			<Content parts={courseParts} />
			<Total total={totalExercises} />
		</div>
	);
};

export default App;
