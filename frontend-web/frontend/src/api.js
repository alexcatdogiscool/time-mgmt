import axios from "axios"

const API_BASE = import.meta.env.DEV ? "http://localhost:8000" : "";

export async function postEvent({ activity, label, note, timestamp }) {
    const res = await axios.post(`${API_BASE}/events`, {
        activity,
        label,
        note,
        timestamp,
    });
    return res.data;
}

export async function getTimeline(date) {
    const res = await axios.get(`${API_BASE}/timeline`, {
        params: { date },
    });
    return res.data;
}