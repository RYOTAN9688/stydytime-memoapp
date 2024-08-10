import { supabase } from "./supabase";

export const fetchStudyRecord = async () => {
  try {
    const { data, error } = await supabase
      .from("studyrecord")
      .select("*")
      .order("id", { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
export const addStudyRecord = async (title: string, time: number) => {
  await supabase.from("studyrecord").insert({ title: title, time: time });
};
