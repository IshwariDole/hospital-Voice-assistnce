export default function Doctors(){
  const doctors = [
    {name:"Dr. Sharma", dept:"Cardiology"},
    {name:"Dr. Patel", dept:"Dermatology"},
    {name:"Dr. Khan", dept:"Orthopedic"},
    {name:"Dr. Mehta", dept:"Neurology"},
  ];

  return (
    <div className="p-10 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">👨‍⚕️ Our Doctors</h1>

      <div className="grid grid-cols-3 gap-6">
        {doctors.map((d,i)=>(
          <div key={i} className="glass-card text-center">
            <div className="text-5xl mb-3">👨‍⚕️</div>
            <h2 className="font-semibold">{d.name}</h2>
            <p className="text-gray-500">{d.dept}</p>
          </div>
        ))}
      </div>
    </div>
  );
}