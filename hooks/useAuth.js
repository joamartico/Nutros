import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import firebaseApp from "../firebase";

export default function useAuth() {
	const [user, setUser] = useState(null);

	useEffect(() => {
		const auth = getAuth(firebaseApp);
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setUser(user);
		});

		return () => unsubscribe();
	}, []);

	return user;
}
