import { GetPageBySlugReturn } from "../../../lib/strapi-cms/strapiApi";
import DynamicZone from "../DynamicZone";

type Props = { page: GetPageBySlugReturn };

export default function DefaultPage(props: Props) {
  const { page } = props;

  if (!page) return null;
  return <DynamicZone sections={page.sections} />;
}
