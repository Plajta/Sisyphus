"use client";

import React, { useState, useRef } from "react";
import { Button } from "~/components/ui/button";

interface UseVoiceRecorderHook {
	isRecording: boolean;
	audioURL: string | null;
	audioBlob: Blob | null;
	error: string | null;
	startRecording: () => Promise<void>;
	stopRecording: () => void;
	getAudioFile: () => File | null;
}

export function useVoiceRecorder(): UseVoiceRecorderHook {
	const [isRecording, setIsRecording] = useState<boolean>(false);
	const [audioURL, setAudioURL] = useState<string | null>(null);
	const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
	const [error, setError] = useState<string | null>(null);
	const mediaRecorder = useRef<MediaRecorder | null>(null);
	const audioChunks = useRef<Blob[]>([]);

	const startRecording = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			mediaRecorder.current = new MediaRecorder(stream);
			audioChunks.current = [];

			mediaRecorder.current.ondataavailable = (event: BlobEvent) => {
				if (event.data.size > 0) {
					audioChunks.current.push(event.data);
				}
			};

			mediaRecorder.current.onstop = () => {
				const blob = new Blob(audioChunks.current, { type: "audio/wav" });
				setAudioBlob(blob);
				const url = URL.createObjectURL(blob);
				setAudioURL(url);
			};

			mediaRecorder.current.start();
			setIsRecording(true);
			setError(null);
		} catch (err) {
			setError("Microphone access denied or not available.");
		}
	};

	const stopRecording = () => {
		if (mediaRecorder.current && isRecording) {
			mediaRecorder.current.stop();
			setIsRecording(false);
		}
	};

	const getAudioFile = (): File | null => {
		if (audioBlob) {
			return new File([audioBlob], "recording.wav", { type: "audio/wav" });
		}
		return null;
	};

	return { isRecording, audioURL, audioBlob, error, startRecording, stopRecording, getAudioFile };
}

export function VoiceRecorder() {
	const { isRecording, audioURL, startRecording, stopRecording, getAudioFile } = useVoiceRecorder();

	const handleSave = () => {
		const file = getAudioFile();
		if (file) {
			const formData = new FormData();
			formData.append("audio", file);

			// Example: You can now send the formData to a server via fetch
			console.log("Audio file prepared:", file);
		}
	};

	return (
		<div className="flex gap-4 items-center h-10">
			<Button
				className={`${isRecording ? "bg-red-600 hover:bg-red-500" : ""} text-white`}
				onClick={isRecording ? stopRecording : startRecording}
			>
				{isRecording ? "Zastavit Nahrávání" : "Začít Nahrávat"}
			</Button>

			{audioURL && !isRecording && <audio controls src={audioURL} />}
		</div>
	);
}
