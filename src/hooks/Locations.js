import { useState, useCallback, useEffect, useRef } from "react";
import { useRequest } from "../utils/Requests";
import { FETCH_LOCATIONS } from "../utils/Endpoints";

function GetLocations() {
  const refReq = useRef(true);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const apiRequest = useRequest();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiRequest({
        url: FETCH_LOCATIONS,
        method: "get",
      });

      setData(response);
    } catch (err) {
      console.log("Error: ", err);
    } finally {
      setLoading(false);
    }
  }, [apiRequest]);

  useEffect(() => {
    if (refReq.current) {
      fetchData();
      refReq.current = false;
    }
  }, [fetchData]);

  return { data, loading };
}

export default GetLocations;
