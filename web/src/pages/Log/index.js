import React, {useState, useEffect} from 'react';
import LogsTable from '../../components/LogsTable';
import { API, showError } from "../../helpers";

const Token = () => {
  const [groups, setGroups] = useState([]);

  const loadGroups = async () => {
    let res = await API.get(`/api/user/groups`);
    const { success, message, data } = res.data;
      const { usableGroups, usableGroupsRatio } = data;
    if (success) {
      // return data is a map, key is group name, value is group description
      // label is group description, value is group name
        let localGroupOptions = Object.keys(usableGroups).map((group) => ({
            label: usableGroups[group],
            value: group,
        })).map((group) => (
           [group.value, group.label]
        ));
        setGroups(new Map(localGroupOptions));
    } else {
      showError(message);
    }
  };

  useEffect(() => {
    loadGroups();
  }, []);

  return(
  <>
    <LogsTable groups={groups} />
  </>
)};

export default Token;
