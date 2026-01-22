import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/nextauth.config";
import ListDetailClient from "./ListDetailClient";

export const metadata: Metadata = {
  title: "Bucket List | BucketList",
  description: "Manage items in your bucket list",
};

export default async function ListDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return <ListDetailClient listId={params.id} />;
}
