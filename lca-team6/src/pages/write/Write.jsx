import { useState } from "react";
import "./WriteModule.css";

const Write = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [aifeedback, setAiFeedback] = useState("");
    const [showFeedback, setShowFeedback] = useState(false);
    const [selectPreset, setSelectPreset] = useState("선택해주세요");
    const [selectTag, setSelectTag] = useState({
        말투: "",
        성격: "",
        스타일: "",
        콘텐츠: ""
    });
    const userPreset = {
        "친구1": {
            말투: ["정중한말투"],
            성격: ["따듯한 상남자형"],
            스타일: ["짧고굵게"],
            콘텐츠: ["명언"]
        }
        ,
        "친구2": {
            말투: ["유쾌한말투"],
            성격: ["긍정적인 응원자형"],
            스타일: ["상세피드백"],
            콘텐츠: ["영화"]
        }
        ,
        "직접 추가": {
            말투: ["123", "223", "333"],
            성격: ["133", "233"],
            스타일: ["133", "233"],
            콘텐츠: ["133", "233"]
        }
    }

    // 피드백받기 체크박스 설정
    const handleFeedbackChecked = (e) => {
        setShowFeedback(e.target.checked);

        if (!e.target.checked) {
            setSelectPreset("선택해");
            setSelectTag([]);
        }

    }

    const handleTagClick = (tag, category) => {
        setSelectTag(prev => {
            if (prev[category] === tag) {
                return {
                    ...prev,
                    [category]: ""
                };
            }

            return {
                ...prev,
                [category]: tag
            };
        });
    };

    return (
        <div className="write-container">
            <header>
                <h2>글쓰기</h2>
            </header>

            {/* 제목입력, 일기입력 필드 */}
            <div className="form-group">
                <div className="form-field">
                    <label htmlFor="title" >제목</label>
                    <input id="title" type="text" placeholder="제목을 입력해주세요" value={title}
                        onChange={(e) => setTitle(e.target.value)} required></input>
                </div>

                <div className="form-field">
                    <label htmlFor="content">일기쓰기</label>
                    <textarea id="content" placeholder="내용을 입력해주세요" value={content}
                        onChange={(e) => setContent(e.target.value)} required rows="10"></textarea>
                </div>

            </div>

            {/* 피드백 받기, 글저장 버튼 */}
            <div className="group-line-up">
                <div className="feedback-checkbox">
                    <input type="checkbox" id="feedbackCheckbox"
                    checked = {showFeedback}
                    onChange={handleFeedbackChecked}></input>
                    <label htmlFor="feedbackCheckbox">피드백 받기</label>
                </div>
                <button className="save-button" type="button">저장하기</button>
            </div>

            {/* 프리셋 선택 메뉴 */}
            {showFeedback && (
            <div className="preset-section">
                <select
                    className="preset-select"
                    value={selectPreset}
                    onChange={(e) => {
                        setSelectPreset(e.target.value);
                        setSelectTag([]);
                    }}>
                    <option>
                        선택해
                    </option>
                    {Object.keys(userPreset).map((preset) => (
                        <option key={preset} value={preset}>
                            {preset}
                        </option>
                    ))}
                </select>

                {selectPreset !== "직접 추가" && userPreset[selectPreset] && (
                    <div>
                        {Object.entries(userPreset[selectPreset]).map(([presetKey, tags]) => (
                            <div key={presetKey} className="presets">
                                <h4>{presetKey}</h4>
                                <div className="presets-grid">
                                    {tags.map((tag) => (
                                        <button
                                            key={tag}
                                            className={`presets-button ${selectTag.includes(tag) ? "selected" : ""}`}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {selectPreset === "직접 추가" && (
                    <div>
                        {Object.entries(userPreset["직접 추가"]).map(([category, tags]) => (
                            <div key={category} className="presets">
                                <h4>{category}</h4>
                                <div className="presets-grid">
                                    {tags.map((tag) => (
                                        <button
                                            key={tag}
                                            className={`presets-button ${selectTag[category] === tag ? "selected" : ""}`}
                                            onClick={() => handleTagClick(tag, category)}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="form-group">
                    <label>ai피드백 (피드백 받기 체크, 프리셋 설정, 저장하기 누르면 나오게 만들기)</label>
                    <textarea className="form-field"
                    id="aifeedback" placeholder="ai피드백 기다리는중" value={aifeedback}
                    onChange={(e) => setAiFeedback(e.target.value)} ></textarea>
                </div>

                <div className="group-line-up">
                    <div></div>
                    <button className="feedback-save-button" type="button">피드백 내용 저장하기</button>
                </div>


                
                
            </div>
            )}
        </div>
    );
};


export default Write;