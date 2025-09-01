import React from "react";
import ClientPage from "./ClientPage"

const fetchSchool = async (schoolId) => {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/schools?sid=${schoolId}`)
  const school = await res.json()
  return school.dbResults
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
      description: "See what others think of the teachers",
    }
  }

  return {
    title: 'Teachers at ' + fetchedSchool.name + ' | Rate Ministère',
    description: "See what others think of teachers at" + fetchedSchool.name,
  }
}

const TeacherRating = ({ params }) => {
  return (
    <ClientPage params={params}/>
  );
};

export default TeacherRating;
