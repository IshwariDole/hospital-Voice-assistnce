import { useNavigate } from "react-router-dom";

export default function Login(){
  const nav = useNavigate();

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
      <div className="glass-card w-96 text-center">
        <h1 className="text-2xl font-bold mb-6">🏥 AI Hospital Login</h1>

        <input className="input mb-3" placeholder="Email"/>
        <input className="input mb-5" type="password" placeholder="Password"/>

        <button 
          className="primary-btn w-full"
          onClick={()=>nav("/dashboard")}
        >
          Login
        </button>
      </div>
    </div>
  );
}