import { useEffect, useState } from "react";
import customAxios from "../../api/customAxios";
import "./Prompts.css";

function Prompts() {
  const [presets, setPresets] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [newPreset, setNewPreset] = useState({
    name: "",
    toneId: "",
    personalityId: "",
    styleId: "",
    contentId: "",
  });
  const [isModified, setIsModified] = useState(false);

  const [toneOptions, setToneOptions] = useState([]);
  const [personalityOptions, setPersonalityOptions] = useState([]);
  const [lengthOptions, setLengthOptions] = useState([]);
  const [contentOptions, setContentOptions] = useState([]);

  const isEditing = selectedIndex === -1;
  const selectedPreset = selectedIndex != null && selectedIndex >= 0 ? presets[selectedIndex] : null;

  useEffect(() => {
    // 사용자의 프리셋 목록 조회
    const fetchPresets = async () => {
      try {
        const response = await customAxios.get(`/prompts`);
        setPresets(response.data.data);
      } catch (error) {
        console.error('개인 설정 목록을 가져오는데 실패했습니다:', error);
      }
    };

    // 옵션 데이터 조회
    const fetchOptions = async () => {
      try {
        const response = await customAxios.get(`/codes/prompts`);
        const data = response.data.data;

        setToneOptions(data.tone);
        setPersonalityOptions(data.personality);
        setLengthOptions(data.style);
        setContentOptions(data.content);        
      } catch (error) {
        console.error("옵션 데이터를 가져오는 데 실패했습니다:", error);
      }
    };

    fetchPresets();
    fetchOptions();
  }, []);

  useEffect(() => {
    if (selectedIndex != null && selectedIndex >= 0) {
      setNewPreset(presets[selectedIndex]);
      setIsModified(false);
    }
  }, [selectedIndex]);

  const handleSelect = (index) => setSelectedIndex(index);

  const handleNew = () => {
    setNewPreset({ name: "", toneId: "", personalityId: "", styleId: "", contentId: "" });
    setSelectedIndex(-1);
    setIsModified(false);
  };


  const handleChange = (field, id) => {
    const updated = { ...newPreset, [field]: id };
    setNewPreset(updated);
  
    if (selectedPreset) {
      const changed =
        updated.name !== selectedPreset.name ||
        updated.toneId !== selectedPreset.toneId ||
        updated.personalityId !== selectedPreset.personalityId ||
        updated.styleId !== selectedPreset.styleId ||
        updated.contentId !== selectedPreset.contentId;
      setIsModified(changed);
    }
  };
  

  //프리셋 프롬프트 저장
  const handleSave = async () => {
    if (!newPreset.name || !newPreset.toneId || !newPreset.personalityId || !newPreset.styleId || !newPreset.contentId) return;
  
    try {
      const response = await customAxios.post("/prompts", newPreset);
      const savedPreset = response.data.data;
  
      setPresets([...presets, savedPreset]); // 서버에서 반환된 데이터로 리스트 업데이트
      setSelectedIndex(presets.length); // 새로 추가된 항목 선택
      setIsModified(false);
    } catch (error) {
      console.error("프리셋 저장에 실패했습니다:", error);
    }
  };
  
  //프리셋 프롬프트 수정
  const handleUpdate = async () => {
    try {
      const response = await customAxios.put(`/prompts/update/${newPreset.id}`, newPreset);
      const updatedPreset = response.data.data;
  
      const updatedPresets = [...presets];
      updatedPresets[selectedIndex] = updatedPreset;
      setPresets(updatedPresets);
      setIsModified(false);
    } catch (error) {
      console.error("프리셋 업데이트에 실패했습니다:", error);
    }
  };
  
  //프리셋 프롬프트 삭제
  const handleDelete = () => {
    const updatedPresets = [...presets];
    updatedPresets.splice(selectedIndex, 1);
    setPresets(updatedPresets);
    setSelectedIndex(null);
    setNewPreset({ name: "", toneId: "", personalityId: "", styleId: "", contentId: "" });
    setIsModified(false);
  };

  const renderOptionGroup = (label, field, options, selected) => (
    <div className="option-group">
      <label>{label}</label>
      <div className="option-buttons">
        {options.map((opt) => {
          const id = opt[`${field}`]; // 예: toneId, personalityId 등
          return (
            <button
              key={id}
              className={selected === id ? "selected" : ""}
              onClick={() => handleChange(field, id)}
            >
              {opt.name}
            </button>
          );
        })}
      </div>
    </div>
  );
  
  const renderViewGroup = (label, options, selected) => (
    <div className="option-group">
      <label>{label}</label>
      <div className="option-buttons">
        {options.map((opt) => {
          const id = opt[`${label.toLowerCase()}Id`] || opt.id;
          return (
            <button
              key={id}
              className={selected === id ? "selected" : ""}
              disabled
            >
              {opt.name}
            </button>
          );
        })}
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
          {renderOptionGroup("톤/말투", "toneId", toneOptions, newPreset.toneId)}
          {renderOptionGroup("성격", "personalityId", personalityOptions, newPreset.personalityId)}
          {renderOptionGroup("길이", "styleId", lengthOptions, newPreset.styleId)}
          {renderOptionGroup("컨텐츠", "contentId", contentOptions, newPreset.contentId)}
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
          {renderOptionGroup("톤/말투", "toneId", toneOptions, newPreset.toneId)}
          {renderOptionGroup("성격", "personalityId", personalityOptions, newPreset.personalityId)}
          {renderOptionGroup("길이", "styleId", lengthOptions, newPreset.styleId)}
          {renderOptionGroup("컨텐츠", "contentId", contentOptions, newPreset.contentId)}
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
