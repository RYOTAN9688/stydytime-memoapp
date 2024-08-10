import { useEffect, useState } from "react";
import "./App.css";
import { supabase } from "./utils/supabase";
import { Loading } from "./Loading";

interface studyRecord {
  id: number;
  title: string;
  time: number;
}

function App() {
  const [records, setRecords] = useState<studyRecord[]>([]);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(true);

  const fetchRecord = async () => {
    try {
      const { data, error } = await supabase
        .from("studyrecord")
        .select("*")
        .order("id", { ascending: false });
      if (error) throw error;
      return setRecords(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const addRecord = async (
    title: string,
    time: number,
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (title === "" || isNaN(time)) {
      setError("タイトルと有効な時間を入力してください");
      return;
    }
    try {
      const { data, error } = await supabase
        .from("studyrecord")
        .insert({ title: title, time: time });
      if (error || data) {
        console.error(error);
        return;
      }
      fetchRecord();
      setTitle("");
      setTime(0);
      setError("");
    } catch (e) {
      console.error(e);
      alert("データの新規登録ができません");
    }
  };
  const deleteRecord = async (title: string, time: number) => {
    try {
      await supabase.from("studyrecord").delete().match({ title, time });
      fetchRecord();
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchRecord();
  }, []);

  useEffect(() => {
    ("");
    setTimeout(() => setLoading(false), 1000);
  }, []);

  useEffect(() => {
    const sum = records.reduce((acc, record) => acc + record.time, 0);
    setTotalTime(sum);
  }, [records]);

  return isLoading ? (
    <Loading />
  ) : (
    <>
      <div className="main">
        <form onSubmit={(e) => addRecord(title, time, e)}>
          <div className="form">
            <div>
              <label>学習内容</label>
              <input
                type="text"
                value={title}
                placeholder="学習した内容を簡潔に入力"
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <div className="timeForm">
                <label>学習時間</label>
                <input
                  type="number"
                  value={time}
                  placeholder="数字で入力"
                  min={0}
                  onChange={(e) => setTime(Number(e.target.value))}
                />
                <p>時間</p>
              </div>
            </div>
          </div>
          <div className="button">
            <button type="submit">登録</button>
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
        <div>
          <p>入力されている学習内容:</p>
          <div>
            {records.map((record) => {
              return (
                <div className="content" key={record.id}>
                  <div className="title-time">
                    <p className="title">{record.title}</p>
                    <p className="time">{`${record.time}時間`}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteRecord(record.title, record.time)}
                  >
                    削除
                  </button>
                </div>
              );
            })}
          </div>
          <div>
            <p>入力されている時間:</p>
            <p>{`${time}時間`}</p>
          </div>
        </div>
        <div>
          <p>{`合計時間:${totalTime}/1000(h)`}</p>
        </div>
      </div>
    </>
  );
}

export default App;
