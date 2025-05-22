import { useEffect, useState } from "react";
import customAxios from "../../api/customAxios.js"
import "./WriteModule.css";
import axios from "axios";

const Write = () => {
    const [title, setTitle] = useState("");
    const [memo, setMemo] = useState("");
    const [aifeedback, setAiFeedback] = useState("");
    const [showFeedback, setShowFeedback] = useState(false);
    const [selectPreset, setSelectPreset] = useState("");
    const [userPreset, setUserPreset] = useState({});
    const [hasFeedbackResponse, setHasFeedbackResponse] = useState(false);
    const [savedMemoId,setSavedMemoId] = useState(null);
    const [selectOption, setSelectOption] = useState({
        말투: null,
        성격: null,
        스타일: null,
        콘텐츠: null
    });

    useEffect(() => {
        if (showFeedback) {
            (async () => {
                try {
                    const response = await customAxios.get('/codes/prompts');

                    // API 응답에서 받은 데이터를 ID와 이름을 가진 객체 배열로 변환
                    const toneOptions = response.data.data.tone.map(item => ({ id: item.id, name: item.name }));
                    const personalityOptions = response.data.data.personality.map(item => ({ id: item.id, name: item.name }));
                    const styleOptions = response.data.data.style.map(item => ({ id: item.id, name: item.name }));
                    const contentOptions = response.data.data.content.map(item => ({ id: item.id, name: item.name }));

                    setUserPreset({
                        ...response.data,
                        "직접 추가": {
                            말투: toneOptions,
                            성격: personalityOptions,
                            스타일: styleOptions,
                            콘텐츠: contentOptions
                        }
                    });
                } catch (error) { // 프리셋 불러오기에 실패한 경우 "직접 추가" 가능
                    console.error("프리셋 불러오기 실패", error);
                     const defaultTone = [
                        { id: 1, name: "정중한(존댓말)" }, { id: 2, name: "친구같은(반말)" }, { id: 3, name: "감성적인" },
                        { id: 4, name: "건조한" }, { id: 5, name: "유쾌한" }, { id: 6, name: "차분한" },
                        { id: 7, name: "따뜻한" }, { id: 8, name: "논리적인" }, { id: 9, name: "직설적인" }
                    ];
                    const defaultPersonality = [
                        { id: 1, name: "따뜻한 상담자형" }, { id: 2, name: "냉철한 분석가형" }, { id: 3, name: "친구같은 말동무형" },
                        { id: 4, name: "꼼꼼한 멘토형" }, { id: 5, name: "긍정적인 응원자형" }, { id: 6, name: "현실적인 조언자형" },
                        { id: 7, name: "공감 중심 대화자형" }, { id: 8, name: "조용한 경청자형" }, { id: 9, name: "활발한 리액션형" }
                    ];
                    const defaultStyle = [
                        { id: 1, name: "짧고 굵게" }, { id: 2, name: "감성적 서술" }, { id: 3, name: "상세 피드백" },
                        { id: 4, name: "분석 + 제안" }, { id: 5, name: "체크리스트 제공" }, { id: 6, name: "스토리텔링 기반" }
                    ];
                    const defaultContent = [
                        { id: 1, name: "책" }, { id: 2, name: "음악" }, { id: 3, name: "영화" },
                        { id: 4, name: "드라마" }, { id: 5, name: "명언" }, { id: 6, name: "유튜브 영상" },
                        { id: 7, name: "웹툰" }, { id: 8, name: "다큐멘터리" }, { id: 9, name: "짧은 글귀" },
                        { id: 10, name: "뉴스 기사" }, { id: 11, name: "인터뷰" }, { id: 12, name: "강의 콘텐츠" }
                    ];
                    setUserPreset({
                        "직접 추가": {
                            말투: defaultTone,
                            성격: defaultPersonality,
                            스타일: defaultStyle,
                            콘텐츠: defaultContent
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
                말투: null,
                성격: null,
                스타일: null,
                콘텐츠: null
            });
        }
    }, [selectPreset, userPreset]);

    // 피드백받기 체크박스 설정
    const handleFeedbackChecked = (e) => {
        setShowFeedback(e.target.checked);

        if (!e.target.checked) {
            setSelectPreset("");
            setSelectOption({
                말투: null,
                성격: null,
                스타일: null,
                콘텐츠: null
            });
        }

    }

    // 직접 설정 할 때 한 type(말투/성격/스타일/콘텐츠)에 option 하나씩만 선택 가능하게 하기
    const handleOptionClick = (optionObj, type) => {
        setSelectOption(prev => {
            // 이미 선택 옵션은 선택해제
            if (prev[type] && prev[type].id === optionObj.id) {
                return {
                    ...prev,
                    [type]: null
                };
            }

            //새로운 옵션 선택
            return {
                ...prev,
                [type]: optionObj //객체 자체를 저장
            };
        });
    };

    // 사용자 입력 검증로직
    const validateForm = () => {
        if (!title.trim()) {
            alert("제목을 입력해주세요!");
            return false;
        }
        if (!memo.trim()) {
            alert("일기 내용을 입력해주세요!");
            return false;
        }

        // 피드백 받기 체크했는데 프리셋 안 골랐을 때
        if (showFeedback && !selectPreset) {
            alert("프리셋을 선택해주세요!");
            return false;
        }

        // "직접 추가"를 선택했을 때 모든 타입에 대해 하나 이상 선택되었는지 확인.
        if (showFeedback && selectPreset === "직접 추가") {
            const selectedOptions = Object.values(selectOption).filter(option => option !== null);
            if (selectedOptions.length === 0) {
                alert("피드백을 받으려면 옵션을 선택해주세요!");
                return false;
            }
        }

        return true;
    };

    // 저장하기 버튼 기능 ( 체크박스 체크 여부에 따른 기능 분리 )
    const handleSave = async () => {
        if (!validateForm()) return;
        try {
            const payload = {
               title: title,
               memo: memo
            };

            console.log("전송할 데이터:", payload);

            // 피드백 받기가 체크된 경우 preset 포함
            if (showFeedback) {
                const selectedPresetIds = {};
                for (const type in selectOption) {
                    if (selectOption[type]) { // 선택된 옵션이 있을 경우에만
                        selectedPresetIds[type] = selectOption[type].id;
                    }
                }
                payload.preset = selectedPresetIds;
            }

            // 체크 안했을때, 저장버튼  항상 메모 저장
            const saveResponse = await customAxios.post('/memos', payload);
            
            console.log("저장 성공:", saveResponse.data);

            // 피드백 받기 체크하고 저장버튼 -> ai 피드백 요청 추가
            if (showFeedback) {
                const aiPresetPayload = {};
                for (const type in selectOption) {
                    if (selectOption[type]) {
                        aiPresetPayload[type] = selectOption[type].id;
                    }
                }
                const aiResponse = await customAxios.post('/analysis', {
                    title,
                    memo,
                    preset: aiPresetPayload // AI 분석 요청에도 ID로 구성된 프리셋을 보냄
                });

                setAiFeedback(aiResponse.data.analysis);
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
                            // setSelectOption([]); //선택 변경시 초기화 시켜주기 useEffect에서 처리하는 것으로 변경
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
                                                key={option.id}
                                                className={`presets-button ${selectOption[type] && selectOption[type].id === option.id ? "selected" : ""}`}
                                                onClick={() => handleOptionClick(option, type)}
                                            >
                                                {option.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                         

                    {/* 설정 직접 추가 */}
                    {selectPreset === "직접 추가" && userPreset["직접 추가"] && (
                        <div>
                            {Object.entries(userPreset["직접 추가"]).map(([type, options]) => (
                                <div key={type} className="presets">
                                    <h4>{type}</h4>
                                    <div className="presets-grid">
                                        {options.map((option) => (
                                            <button
                                                key={option.id}
                                                className={`presets-button ${selectOption[type] && selectOption[type].id === option.id ? "selected" : ""}`}
                                                onClick={() => handleOptionClick(option, type)}
                                            >
                                                {option.name}
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