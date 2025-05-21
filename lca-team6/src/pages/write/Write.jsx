import { useState } from "react";
import customAxios from "../../api/customAxios.js"
import "./WriteModule.css";

const Write = () => {
    const [title, setTitle] = useState("");
    const [memo, setMemo] = useState("");
    const [aifeedback, setAiFeedback] = useState("");
    const [showFeedback, setShowFeedback] = useState(false);
    const [selectPreset, setSelectPreset] = useState("선택해주세요");
    const [hasFeedbackResponse, setHasFeedbackResponse] = useState(false);
    const [selectOption, setSelectOption] = useState({
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
            setSelectOption([]);
        }

    }

    // 직접 설정 할 때 한 type(말투/성격/스타일/콘텐츠)에 option 하나씩만 선택 가능하게 하기
    const handleOptionClick = (option, type) => {
        setSelectOption(prev => {
            if (prev[type] === option) {
                return {
                    ...prev,
                    [type]: ""
                };
            }

            return {
                ...prev,
                [type]: option
            };
        });
    };

    // 저장하기 버튼 기능 ( 체크박스 체크 여부에 따른 기능 분리 )
    const handleSave = async () => {
        try {

            // 체크 안했을때, 저장버튼
            const response = await customAxios.post('/memos', {
                title: title,
                memo: memo,
                ...(showFeedback && {
                    preset: selectOption
                })
            });

            alert("저장되었습니다!");
            // 초기화
            setTitle("");
            setMemo("");

            // 피드백 받기 체크하고 저장버튼 -> ai 피드백 요청 추가
            if (showFeedback) {
                const aiResponse = await customAxios.post('/analysis', {
                    title,
                    memo,
                    preset: selectOption
                });

                setAiFeedback(aiResponse.data.analysis); //추후 수정 포인트
                setHasFeedbackResponse(true);
            } else {
                setHasFeedbackResponse(false);
            }

        } catch (error) {
            console.error("저장 실패", error);
            alert("저장에 실패했습니다.");
        }
    };
    return (

        // 페이지 이름 ( 추후 스타일 수정 고려 )
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
                    <label htmlFor="memo">일기쓰기</label>
                    <textarea id="memo" placeholder="내용을 입력해주세요" value={memo}
                        onChange={(e) => setMemo(e.target.value)} required rows="10"></textarea>
                </div>

            </div>

            {/* 피드백 받기, 글저장 버튼 */}
            <div className="group-line-up">
                <div className="feedback-checkbox">
                    <input type="checkbox" id="feedbackCheckbox"
                        checked={showFeedback}
                        onChange={handleFeedbackChecked}></input>
                    <label htmlFor="feedbackCheckbox">피드백 받기</label>
                </div>
                <button className="save-button" type="button" onClick={handleSave}>저장하기</button>
            </div>

            {/* 프리셋 선택 메뉴 */}
            {showFeedback && (
                <div className="preset-section">
                    <select
                        className="preset-select"
                        value={selectPreset}
                        onChange={(e) => {
                            setSelectPreset(e.target.value);
                            setSelectOption([]);
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

                    {/* 미리 지정한 개인 설정 프리셋 */}
                    {selectPreset !== "직접 추가" && userPreset[selectPreset] && (
                        <div>
                            {Object.entries(userPreset[selectPreset]).map(([type, options]) => (
                                <div key={type} className="presets">
                                    <h4>{type}</h4>
                                    <div className="presets-grid">
                                        {options.map((option) => (
                                            <button
                                                key={option}
                                                className={`presets-button ${selectOption.includes(option) ? "selected" : ""}`}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* 설정 직접 추가 */}
                    {selectPreset === "직접 추가" && (
                        <div>
                            {Object.entries(userPreset["직접 추가"]).map(([type, options]) => (
                                <div key={type} className="presets">
                                    <h4>{type}</h4>
                                    <div className="presets-grid">
                                        {options.map((option) => (
                                            <button
                                                key={option}
                                                className={`presets-button ${selectOption[type] === option ? "selected" : ""}`}
                                                onClick={() => handleOptionClick(option, type)}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ai피드백 받는 필드 + 피드백 저장 버튼 */}
                    {showFeedback && hasFeedbackResponse && (
                        <div>
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
            )}
        </div>
    );
};


export default Write;