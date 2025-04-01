export default async function page({
  params,
}: {
  params: Promise<{ role: Rolestype }>;
}) {
  const { role } = await params;
  return <div>{role}</div>;
}
