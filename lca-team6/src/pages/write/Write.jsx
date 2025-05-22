import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import customAxios from "../../api/customAxios.js";
import "./WriteModule.css";

const Write = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [memo, setMemo] = useState("");
    const [aiFeedback, setAiFeedback] = useState("");
    const [showFeedback, setShowFeedback] = useState(false);
    const [emotions, setEmotions] = useState([]);

    const [presets, setPresets] = useState([]);
    const [options, setOptions] = useState({
        tone: [], personality: [], style: [], content: []
    })
    const [hasFeedbackResponse, setHasFeedbackResponse] = useState(false);
    const [savedMemoId, setSavedMemoId] = useState(null);
    const [selectedPresetId, setSelectedPresetId] = useState(0);
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
                    const { data: promptsRes } = await customAxios.get('/prompts');

                    setPresets(promptsRes.data);

                    const { data: codesRes } = await customAxios.get('/codes/prompts');

                    setOptions({
                        tone: codesRes.data.tone.map(item => ({ id: item.toneId, name: item.name })),
                        personality: codesRes.data.personality.map(item => ({ id: item.personalityId, name: item.name })),
                        style: codesRes.data.style.map(item => ({ id: item.styleId, name: item.name })),
                        content: codesRes.data.content.map(item => ({ id: item.contentId, name: item.name }))
                    });

                } catch (error) { // 프리셋 불러오기에 실패한 경우 "직접 추가" 가능
                    console.error("프리셋 불러오기 실패", error);
                }
            })();
        }

    }, [showFeedback]);

    useEffect(() => {
        if (selectedPresetId === 0) {
            setSelectOption({ 말투: null, 성격: null, 스타일: null, 콘텐츠: null });
        } else if (selectedPresetId === "직접 추가") {
            setSelectOption({ 말투: null, 성격: null, 스타일: null, 콘텐츠: null });
        } else {
            const preset = presets.find(x => x.presetPromptId === selectedPresetId);
            if (preset) {
                const 말투 = options.tone.find(option => option.id === preset.toneId);
                const 성격 = options.personality.find(option => option.id === preset.personalityId);
                const 스타일 = options.style.find(option => option.id === preset.styleId);
                const 콘텐츠 = options.content.find(option => option.id === preset.contentId);

                console.log("찾은 옵션들:", { 말투, 성격, 스타일, 콘텐츠 });

                setSelectOption({ 말투, 성격, 스타일, 콘텐츠 });
            }
        }
    }, [selectedPresetId, presets, options]);

    // 피드백받기 체크박스 설정
    const handleFeedbackChecked = (e) => {
        setShowFeedback(e.target.checked);

        if (!e.target.checked) {
            setSelectedPresetId(0);
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
        if (showFeedback && !selectedPresetId) {
            alert("프리셋을 선택해주세요!");
            return false;
        }

        // "직접 추가"를 선택했을 때 모든 타입에 대해 하나 이상 선택되었는지 확인.
        if (showFeedback && selectedPresetId === "직접 추가") {
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
            // 피드백이 체크되어 있으면 AI 분석 요청
            if (showFeedback) {
                try {
                    // 피드백 O: analysis 호출 (메모+분석 둘 다 처리)
                    const analysisPayload = {
                        title, memo,
                        tone: selectOption.말투?.id,
                        personality: selectOption.성격?.id,
                        style: selectOption.스타일?.id,
                        content: selectOption.콘텐츠?.id
                    };
                    const analysisRes = await customAxios.post('/analysis', analysisPayload);

                    const responseData = analysisRes.data.data;

                    // 디버깅 로그
                    console.log("=== 프론트엔드 응답 확인 ===");
                    console.log("responseData:", responseData);
                    console.log("analysis:", responseData.analysis);
                    console.log("emotions:", responseData.emotions);
                    console.log("memoId:", responseData.memoId);

                    // AI 피드백 결과 저장
                    setSavedMemoId(responseData.memoId);
                    setAiFeedback(responseData.analysis || "분석 결과를 가져올 수 없습니다.");
                    setEmotions(responseData.emotions || []);
                    setHasFeedbackResponse(true);

                    alert("저장되었습니다!");

                    console.log("=== 상태 설정 완료 ===");
                    console.log("aiFeedback:", responseData.analysis?.substring(0, 50));
                    console.log("emotions length:", responseData.emotions?.length);

                } catch (analysisError) {
                    console.error("AI 분석 에러:", analysisError);

                    // AI 분석 실패해도 메모는 저장된 상태
                    alert("메모는 저장되었지만 AI 분석에 실패했습니다. 나중에 다시 시도해주세요.");

                    setAiFeedback("AI 분석에 일시적인 문제가 발생했습니다.");
                    setEmotions([]);
                    setHasFeedbackResponse(true);
                }
            } else {
                // 피드백 X: 메모만 저장
                const payload = { title, memo };
                const saveRes = await customAxios.post('/memos', payload);
                setSavedMemoId(saveRes.data.memoId);
                setHasFeedbackResponse(false);
                // 폼 초기화 (제목, 메모만), 홈으로 이동
                alert("저장되었습니다!");
                setTitle("");
                setMemo("");
                navigate("/");
            }

        } catch (err) {
            console.error("저장 에러:", err);

            // 에러 응답 상세 정보
            if (err.response) {
                console.error("에러 응답:", err.response);
                alert(`저장에 실패했습니다. (${err.response.status}: ${err.response.data?.message || "알 수 없는 오류"})`);
            } else {
                // 피드백 없이 메모만 저장
                const payload = { title, memo };
                const saveRes = await customAxios.post('/memos', payload);
                setSavedMemoId(saveRes.data.memoId);
                alert("저장에 실패했습니다. 네트워크를 확인해주세요.");
            }
        }
    };

    const handleAiFeedbackSave = async () => {
        try {
            console.log("=== 피드백 저장 디버깅 ===");
            console.log("savedMemoId:", savedMemoId);
            console.log("selectedPresetId:", selectedPresetId);
            console.log("aiFeedback length:", aiFeedback?.length);
            console.log("emotions length:", emotions?.length);

            await customAxios.post('/analysis/save', {
                memoId: savedMemoId,
                presetPromptId: selectedPresetId === "직접 추가" ? null : selectedPresetId,
                analysis: aiFeedback,
                emotions: emotions
            });
            alert("피드백이 저장되었습니다.");
            navigate("/");
        } catch (err) {
            console.error(err);
            alert("피드백 저장에 실패했습니다.");
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
                    <label>프리셋 선택하기  </label>
                    <select
                        className="preset-select"
                        value={selectedPresetId}
                        onChange={(e) => {
                            setSelectedPresetId(e.target.value);
                            // setSelectOption([]); //선택 변경시 초기화 시켜주기 useEffect에서 처리하는 것으로 변경
                        }}>
                        <option value="">
                            선택해주세요
                        </option>
                        {presets.map((preset) => (
                            <option key={preset.presetPromptId} value={preset.presetPromptId}>
                                {preset.name}
                            </option>
                        ))}
                        <option value="직접 추가">직접 추가</option>
                    </select>

                    {/* 미리 지정한 개인 설정 프리셋 */}
                    {selectedPresetId !== "직접 추가" && selectedPresetId !== 0 && selectedPresetId && (
                        <div>
                            <h4>선택된 프리셋: {presets.find(p => p.presetPromptId == selectedPresetId)?.name}</h4>

                            <div style={{ padding: '10px', backgroundColor: '#f5f5f5', marginTop: '10px' }}>
                                <p><strong>말투:</strong> {options.tone.find(t => t.id == presets.find(p => p.presetPromptId == selectedPresetId)?.toneId)?.name || "설정되지 않음"}</p>
                                <p><strong>성격:</strong> {options.personality.find(p => p.id == presets.find(pr => pr.presetPromptId == selectedPresetId)?.personalityId)?.name || "설정되지 않음"}</p>
                                <p><strong>스타일:</strong> {options.style.find(s => s.id == presets.find(pr => pr.presetPromptId == selectedPresetId)?.styleId)?.name || "설정되지 않음"}</p>
                                <p><strong>콘텐츠:</strong> {options.content.find(c => c.id == presets.find(pr => pr.presetPromptId == selectedPresetId)?.contentId)?.name || "설정되지 않음"}</p>
                            </div>
                        </div>
                    )}

                    {/* 설정 직접 추가 */}
                    {selectedPresetId === "직접 추가" && (
                        <div>
                            {Object.entries(options).map(([type, options]) => (
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
                                <label>AI 피드백</label>
                                <textarea
                                    className="form-field"
                                    id="aiFeedback"
                                    placeholder="AI 피드백을 불러오는 중..."
                                    value={aiFeedback}
                                    onChange={(e) => setAiFeedback(e.target.value)}
                                    rows="8"
                                />
                            </div>
                            {/* 감정 분석 결과도 보여주기 (선택사항) */}
                            {emotions.length > 0 && (
                                <div className="emotions-display">
                                    <h5>감정 분석 결과:</h5>
                                    <div className="emotions-grid">
                                        {emotions.map((emotion) => (
                                            <div key={emotion.code} className="emotion-item">
                                                <span>{emotion.name}</span>
                                                <span className="score">{emotion.score}/10</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="group-line-up">
                                <div></div>
                                <button
                                    className="feedback-save-button"
                                    type="button"
                                    onClick={handleAiFeedbackSave}
                                    disabled={!aiFeedback.trim()}
                                >
                                    피드백 내용 저장하기
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            )}

        </div>
    )
}


export default Write;