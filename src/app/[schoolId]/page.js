import React from "react";
import ClientPage from "./ClientPage"

const fetchSchool = async (schoolId) => {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/schools?sid=${schoolId}`)
    if (!res.ok) return null;
    const school = await res.json()
    return school?.dbResults
  } catch (error) {
    console.error("Error fetching school:", error);
    return null;
  }
}

export async function generateMetadata(
  { params, searchParams },
  parent
) {
  const schoolId = (await params).schoolId;

  const fetchedSchool = await fetchSchool(schoolId)

  if (fetchedSchool == 'No school found' || !fetchedSchool) {
    return {
      title: 'Rate Ministère',
      description: "See what others think of this school",
    }
  }

  return {
    title: fetchedSchool.name + ' | Rate Ministère',
    description: "See what others think of " + fetchedSchool.name,
  }
}

const TeacherRating = ({ params }) => {
  return (
    <ClientPage params={params}/>
  );
};

export default TeacherRating;