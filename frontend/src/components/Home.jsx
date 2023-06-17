import React from "react";
import { useAuth } from "../hooks";
import { useNavigate } from "react-router-dom";
import Container from "./Container";
import NotVerified from "./user/NotVerified";

export default function Home() {
	return <NotVerified />;
}
