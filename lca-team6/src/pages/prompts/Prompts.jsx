// src/pages/prompts/Prompts.jsx

import { useEffect, useState } from "react";
import "./Prompts.css";

const toneOptions = [
  "정중한(존댓말)", "친구같은(반말)", "감성적인", "건조한", "유쾌한", "차분한", "따뜻한", "논리적인", "직설적인"
];
const personalityOptions = [
  "따뜻한 상담자형", "냉철한 분석가형", "친구같은 말동무형", "꼼꼼한 멘토형", "긍정적인 응원자형",
  "현실적인 조언자형", "공감 중심 대화자형", "조용한 경청자형", "활발한 리액션형"
];
const lengthOptions = [
  "짧고 굵게", "감성적 서술", "상세 피드백", "분석 + 제안", "체크리스트 제공", "스토리텔링 기반"
];
const contentOptions = [
  "책", "음악", "영화", "드라마", "명언", "유튜브 영상", "웹툰", "다큐멘터리", "짧은 글귀", "뉴스 기사", "인터뷰", "강의 콘텐츠"
];

function Prompts() {
  const [presets, setPresets] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [newPreset, setNewPreset] = useState({
    name: "",
    tone: "",
    personality: "",
    length: "",
    content: "",
  });
  const [isModified, setIsModified] = useState(false);

  const isEditing = selectedIndex === -1;
  const selectedPreset = selectedIndex != null && selectedIndex >= 0 ? presets[selectedIndex] : null;

  useEffect(() => {
    if (selectedIndex != null && selectedIndex >= 0) {
      setNewPreset(presets[selectedIndex]);
      setIsModified(false);
    }
  }, [selectedIndex]);

  const handleSelect = (index) => setSelectedIndex(index);

  const handleNew = () => {
    setNewPreset({ name: "", tone: "", personality: "", length: "", content: "" });
    setSelectedIndex(-1);
    setIsModified(false);
  };

  const handleChange = (field, value) => {
    const updated = { ...newPreset, [field]: value };
    setNewPreset(updated);

    if (selectedPreset) {
      const changed =
        updated.name !== selectedPreset.name ||
        updated.tone !== selectedPreset.tone ||
        updated.personality !== selectedPreset.personality ||
        updated.length !== selectedPreset.length ||
        updated.content !== selectedPreset.content;
      setIsModified(changed);
    }
  };

  const handleSave = () => {
    if (!newPreset.name || !newPreset.tone || !newPreset.personality || !newPreset.length || !newPreset.content) return;
    setPresets([...presets, newPreset]);
    setSelectedIndex(presets.length);
    setIsModified(false);
  };

  const handleUpdate = () => {
    const updatedPresets = [...presets];
    updatedPresets[selectedIndex] = newPreset;
    setPresets(updatedPresets);
    setIsModified(false);
  };

  const handleDelete = () => {
    const updatedPresets = [...presets];
    updatedPresets.splice(selectedIndex, 1);
    setPresets(updatedPresets);
    setSelectedIndex(null);
    setNewPreset({
      name: "",
      tone: "",
      personality: "",
      length: "",
      content: "",
    });
    setIsModified(false);
  };

  const renderOptionGroup = (label, field, options, selected) => (
    <div className="option-group">
      <label>{label}</label>
      <div className="option-buttons">
        {options.map((opt) => (
          <button
            key={opt}
            className={selected === opt ? "selected" : ""}
            onClick={() => handleChange(field, opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );

  const renderViewGroup = (label, options, selected) => (
    <div className="option-group">
      <label>{label}</label>
      <div className="option-buttons">
        {options.map((opt) => (
          <button key={opt} className={selected === opt ? "selected" : ""} disabled>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="prompts-container">
      <div className="sidebar">
        <h3>개인 설정 목록</h3>
        <ul>
          {presets.map((preset, idx) => (
            <li key={idx} onClick={() => handleSelect(idx)}>
              {preset.name}
            </li>
          ))}
        </ul>
        <button onClick={handleNew}>+ 새 설정 추가</button>
      </div>

      {isEditing ? (
        <div className="editor">
          <input
            type="text"
            placeholder="설정 이름을 입력하세요"
            value={newPreset.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
          {renderOptionGroup("톤/말투", "tone", toneOptions, newPreset.tone)}
          {renderOptionGroup("성격", "personality", personalityOptions, newPreset.personality)}
          {renderOptionGroup("길이", "length", lengthOptions, newPreset.length)}
          {renderOptionGroup("컨텐츠", "content", contentOptions, newPreset.content)}
          <button className="save-btn" onClick={handleSave}>저장하기</button>
        </div>
      ) : selectedPreset ? (
        <div className="editor">
          <input
            type="text"
            placeholder="설정 이름을 입력하세요"
            value={newPreset.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
          {renderOptionGroup("톤/말투", "tone", toneOptions, newPreset.tone)}
          {renderOptionGroup("성격", "personality", personalityOptions, newPreset.personality)}
          {renderOptionGroup("길이", "length", lengthOptions, newPreset.length)}
          {renderOptionGroup("컨텐츠", "content", contentOptions, newPreset.content)}
          <div style={{ marginTop: "20px" }}>
            <button
              className="save-btn"
              onClick={handleUpdate}
              style={{ marginRight: "10px" }}
              disabled={!isModified}
            >
              저장하기
            </button>
            <button className="save-btn" onClick={handleDelete} style={{ backgroundColor: "#e94e4e" }}>
              삭제하기
            </button>
          </div>
        </div>
      ) : (
        <div className="default-prompt-preview">
          <h2>미리보기</h2>
          {renderViewGroup("톤/말투", toneOptions, null)}
          {renderViewGroup("성격", personalityOptions, null)}
          {renderViewGroup("길이", lengthOptions, null)}
          {renderViewGroup("컨텐츠", contentOptions, null)}
        </div>
      )}
    </div>
  );
}

export default Prompts;
