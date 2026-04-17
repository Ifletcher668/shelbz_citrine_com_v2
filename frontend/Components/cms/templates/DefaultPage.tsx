import { GetPageBySlugReturn } from "../../../lib/strapi-cms/strapiApi";
import DynamicZone from "../DynamicZone";

type Props = { page: GetPageBySlugReturn };

export default function DefaultPage(props: Props) {
  const { page } = props;

  return <DynamicZone sections={page.sections} />;
}
