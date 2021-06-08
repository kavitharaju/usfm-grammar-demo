import React, { useEffect, useContext } from "react";
import TextField from "@material-ui/core/TextField";
import Download from "./common/Download";
import Upload from "./common/Upload";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { Toolbar } from "@material-ui/core";
import { GrammarContext } from "./context/GrammarContext";
import ParseJson from "./common/ParseJson";

const grammar = require("usfm-grammar");

function TabPanel(props) {
  const { children, value, index } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && children}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  tab: {
    minWidth: 72,
  },
}));

function RightPanel() {
  const classes = useStyles();
  const {
    usfmValue,
    mode,
    jsonValue,
    setJsonValue,
    csvValue,
    setCsvValue,
    tsvValue,
    tabValue,
    setTabValue,
    setTsvValue,
    alert,
    setOpen,
  } = useContext(GrammarContext);

  const getExtension = () => {
    if (tabValue === 0) {
      return "json";
    } else if (tabValue === 1) {
      return "csv";
    } else if (tabValue === 2) {
      return "tsv";
    }
  };

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const handleTextChange = (event) => {
    setJsonValue(event.target.value);
  };
  const displayMessage = (event) => {
    alert("warning", "Cannot Delete CSV/TSV Data");
  };

  useEffect(() => {
    // check for usfmValue in empty cases
    const checkUSFMValue = () => {
      if (usfmValue === "") {
        alert("warning", "No Data to Convert");
        return "";
      }
      return mode === "relaxed"
        ? new grammar.USFMParser(usfmValue, grammar.LEVEL.RELAXED)
        : new grammar.USFMParser(usfmValue);
    };
    const parseToCSV = async () => {
      try {
        const myUSFMParser = checkUSFMValue();
        if (myUSFMParser === "") {
          return;
        }
        await setCsvValue(myUSFMParser.toCSV());
      } catch (e) {
        await setCsvValue(e);
        alert("error", "Error parsing USFM data");
      }
      setOpen(false);
    };
    const parseToTSV = () => {
      try {
        const myUSFMParser = checkUSFMValue();
        if (myUSFMParser === "") {
          return;
        }
        setTsvValue(myUSFMParser.toTSV());
      } catch (e) {
        setTsvValue(e);
        alert("error", "Error parsing USFM data");
      }
      setOpen(false);
    };
    if (tabValue === 1) {
      setOpen(true);
      setTimeout(() => {
        parseToCSV();
      }, 500);
    } else if (tabValue === 2) {
      setOpen(true);
      setTimeout(() => {
        parseToTSV();
      }, 500);
    }
  }, [tabValue, usfmValue, mode, alert, setCsvValue, setTsvValue, setOpen]);

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Toolbar>
          <Tabs
            value={tabValue}
            onChange={handleChange}
            aria-label="simple tabs"
            style={{ width: "100%" }}
          >
            <Tab label="JSON" style={{ minWidth: 70 }} />
            <Tab label="CSV" style={{ minWidth: 70 }} />
            <Tab label="TSV" style={{ minWidth: 70 }} />
            <ParseJson />
          </Tabs>
          <Upload setValue={setJsonValue} type="json" />
          <Download extension={getExtension()} />
        </Toolbar>
      </AppBar>
      <TabPanel value={tabValue} index={0}>
        <TextField
          fullWidth={true}
          id="outlined-multiline-static"
          multiline
          rows={34}
          value={jsonValue}
          onChange={handleTextChange}
          variant="outlined"
        />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <TextField
          fullWidth={true}
          id="outlined-multiline-static"
          multiline
          rows={34}
          value={csvValue}
          onChange={displayMessage}
          variant="outlined"
        />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <TextField
          fullWidth={true}
          id="outlined-multiline-static"
          multiline
          rows={34}
          value={tsvValue}
          onChange={displayMessage}
          variant="outlined"
        />
      </TabPanel>
    </div>
  );
}

export default RightPanel;
