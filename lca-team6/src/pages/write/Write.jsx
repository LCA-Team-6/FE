import { useEffect, useState } from "react";
import customAxios from "../../api/customAxios.js"
import "./WriteModule.css";

const Write = () => {
    const [title, setTitle] = useState("");
    const [memo, setMemo] = useState("");
    const [aifeedback, setAiFeedback] = useState("");
    const [showFeedback, setShowFeedback] = useState(false);
    const [selectPreset, setSelectPreset] = useState("");
    const [userPreset, setUserPreset] = useState({});
    const [hasFeedbackResponse, setHasFeedbackResponse] = useState(false);
    const [selectOption, setSelectOption] = useState({
        말투: "",
        성격: "",
        스타일: "",
        콘텐츠: ""
    });

    useEffect(() => {
        if (showFeedback) {
            (async () => {
                try {
                    const response = await customAxios.get('/prompts');
                    setUserPreset({
                        ...response.data,
                        "직접 추가": {
                            말투: ["정중한(존댓말)", "친구같은(반말)", "감성적인", "건조한", "유쾌한", "차분한", "따뜻한", "논리적인", "직설적인"],
                            성격: ["따뜻한 상담자형", "냉철한 분석가형", "친구같은 말동무형", "꼼꼼한 멘토형", "긍정적인 응원자형", "현실적인 조언자형", "공감 중심 대화자형", "조용한 경청자형", "활발한 리액션형"],
                            스타일: ["짧고 굵게", "감성적 서술", "상세 피드백", "분석 + 제안", "체크리스트 제공", "스토리텔링 기반"],
                            콘텐츠: ["책", "음악", "영화", "드라마", "명언", "유튜브 영상", "웹툰", "다큐멘터리", "짧은 글귀", "뉴스 기사", "인터뷰", "강의 콘텐츠"]
                        }
                    });
                } catch (error) { // 프리셋 불러오기에 실패한 경우 "직접 추가" 가능
                    console.error("프리셋 불러오기 실패", error);
                    setUserPreset({
                        "직접 추가": {
                            말투: ["정중한(존댓말)", "친구같은(반말)", "감성적인", "건조한", "유쾌한", "차분한", "따뜻한", "논리적인", "직설적인"],
                            성격: ["따뜻한 상담자형", "냉철한 분석가형", "친구같은 말동무형", "꼼꼼한 멘토형", "긍정적인 응원자형", "현실적인 조언자형", "공감 중심 대화자형", "조용한 경청자형", "활발한 리액션형"],
                            스타일: ["짧고 굵게", "감성적 서술", "상세 피드백", "분석 + 제안", "체크리스트 제공", "스토리텔링 기반"],
                            콘텐츠: ["책", "음악", "영화", "드라마", "명언", "유튜브 영상", "웹툰", "다큐멘터리", "짧은 글귀", "뉴스 기사", "인터뷰", "강의 콘텐츠"]
                        }
                    });
                }
            })();
        }
    }, [showFeedback]);

    useEffect(() => {
        if (selectPreset && selectPreset !== "직접 추가" && userPreset[selectPreset]) {
            setSelectOption(userPreset[selectPreset]);
        } else if (selectPreset === "직접 추가") {
            setSelectOption({
                말투: "",
                성격: "",
                스타일: "",
                콘텐츠: ""
            });
        }
    }, [selectPreset]);

    // 피드백받기 체크박스 설정
    const handleFeedbackChecked = (e) => {
        setShowFeedback(e.target.checked);

        if (!e.target.checked) {
            setSelectPreset("선택해주세요");
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
            const payload = {
                title,
                memo
            };

            // 피드백 받기가 체크된 경우 preset 포함
            if (showFeedback) {
                payload.preset = selectOption;
            }

            // 체크 안했을때, 저장버튼  항상 메모 저장
            const saveResponse = await customAxios.post('/memos', payload);

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

            alert("저장되었습니다!");
            // 초기화
            setTitle("");
            setMemo("");

        } catch (error) {
            console.error("저장 실패", error);
            alert("저장에 실패했습니다.");
        }
    };

    const handleAiFeedbackSave = async () => {
        const aiMemoResponse = await customAxios.post('analysis/save', {
            analysis: aifeedback
        })
    }
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
                    <label>프리셋 선택하기  </label>
                    <select
                        className="preset-select"
                        value={selectPreset}
                        onChange={(e) => {
                            setSelectPreset(e.target.value);
                            setSelectOption([]); //선택 변경시 초기화 시켜주기
                        }}>
                        <option value="">
                            선택해주세요
                        </option>
                        {Object.keys(userPreset).map((presetName) => (
                            <option key={presetName} value={presetName}>
                                {presetName}
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
                                <button className="feedback-save-button" type="button" onClick={handleAiFeedbackSave}>피드백 내용 저장하기</button>
                            </div>
                        </div>
                    )}

                </div>
            )}
        </div>
    );
};


export default Write;