import { useState } from "react";
import "./WriteModule.css";

const Write = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [selectPreset, setSelectPreset] = useState("선택해주세요");
    const userPreset = {
        "친구1": [
            "정중한말투", "따듯한 상남자형", "짧고굵게", "명언"
        ],
        "친구2": [
            "유쾌한말투", "긍정적인 응원자형", "상세피드백", "영화"
        ],
        "직접 추가": [
            "말투", "성격", "응답 스타일", "콘테츠"
        ]
    }

    return (
        <div className="write-container">
            <header>
                <h2>글쓰기</h2>
            </header>

            <div className="form-group">
                <div className="form-field">
                    <label htmlFor="title" >제목</label>
                    <input id="title" type="text" placeholder="제목을 입력해주세요" value={title}
                        onChange={(e) => setTitle(e.target.value)} required></input>
                </div>

                <div className="form-field">
                    <label htmlFor="content">일기쓰기</label>
                    <textarea id="content" placeholder="내용을 입력해주세요" value={content}
                        onChange={(e) => setContent(e.target.value)} required row="10"></textarea>
                </div>
            </div>
            <div className="group-line-up">
                <div className="feedback-checkbox">
                    <input type="checkbox" id="feedbackCheckbox"></input>
                    <label htmlFor="feedbackCheckbox">피드백 받기</label>
                </div>
                <button className="save-button" type="button">저장하기</button>
            </div>
        </div>
    );
}

export default Write;