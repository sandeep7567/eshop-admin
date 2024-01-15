interface DashboardPageProps {
  params: { storeId: string }
};

const DashboardPage:React.FC<DashboardPageProps> = async ({
  params
}: DashboardPageProps) => {
  const store = await prisma?.store.findFirst({
    where: { id: params?.storeId }
  });
  return (
    <div>
      Active Store: { JSON.stringify(store) }
    </div>
  )
};

export default DashboardPage;