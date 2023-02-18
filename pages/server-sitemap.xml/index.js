import { getServerSideSitemap } from "next-sitemap";
import foodData from "../../foodData_survey.json";

export async function getServerSideProps(context) {
	const fields = foodData?.map((food) => ({
		loc: `https://nutros.vercel.app/food/${food?.fdcId}`,
		lastmod: new Date().toISOString(),
	}));
	return getServerSideSitemap(context, fields);
}

export default function Sitemap() {}
