import { Box, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Switch } from '@mui/material';
import { useEffect, useState } from 'react';

const LANGUAGES = [
  {name: "Python", value: "python"},
  {name: "Javascript", value: "javascript"},
  {name: "Arduino", value: "c++"},
]

function setUp() {
  localStorage.setItem(
    "editorLanguage",
    localStorage.getItem("editorLanguage") || LANGUAGES[0].value);
}

export default function PanelPropiedades() {
  useEffect(() => {
    setUp();
  }, []);
  const [language, setLanguage] = useState("python");
  const [blocklyEnabled, setBlocklyEnabled] = useState(true);

  const handleSetLanguage = (event) => {
    const lang = event.target.value; 
    setLanguage(lang);
    localStorage.setItem("editorLanguage", lang);
  };

  const handleSetBlocklyEnabled = (event) => {
    setBlocklyEnabled(event.target.checked)
  };

  return (
    <Box sx={{display: "flex", m: 5}} className="panel">
      <FormControl fullWidth>
        <InputLabel id="language-select-label1">Lenguaje</InputLabel>
        <Select sx={{maxHeight: 100}}
          labelId="Lenguaje"
          id="language-select"
          value={language}
          label="Lenguaje"
          onChange={handleSetLanguage}
        >
          <MenuItem value={"python"}>Python</MenuItem>
          <MenuItem value={"javascript"}>Javascript</MenuItem>
          <MenuItem value={"arduino"}>Arduino</MenuItem>
        </Select>
        <FormControlLabel
          control={
            <Switch checked={blocklyEnabled} onChange={handleSetBlocklyEnabled} inputProps={{ 'aria-label': 'controlled' }} />
          }
          label="Activar Blockly"
        />
      </FormControl>
    </Box>
  )
}