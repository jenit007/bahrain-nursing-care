import { useNavigate } from "react-router-dom";
import "./Services.css";

function Services() {
  const navigate = useNavigate();

  const services = [
    {
      id: "patient",
      title: "Patient Care",
      description: "Professional care and support for patients.",
      icon: "✚",
    },
    {
      id: "elder",
      title: "Elder Care",
      description: "Dedicated care and assistance for elderly people.",
      icon: "♡",
    },
    {
      id: "newborn",
      title: "Newborn Care",
      description: "Specialized care and support for newborn babies.",
      icon: "♧",
    },
    {
      id: "children",
      title: "Children's Care",
      description: "Safe and caring support for children.",
      icon: "♙",
    },
  ];

  const handleServiceSelect = (service) => {
    navigate(`/care/${service.id}`);
  };

  return (
    <div className="services-page">

      <header className="services-header">
        <div className="services-logo">
          <span>✚</span>
          <div>
            <h1>Bahrain Nursing Care</h1>
            <p>Professional Home Care Services</p>
          </div>
        </div>

        <div className="user-section">
          <span className="user-icon">◉</span>
          <span>User</span>
        </div>
      </header>

      <main className="services-main">

        <div className="services-heading">
          <h2>Our Nursing Services</h2>
          <p>
            Choose the care service you require
          </p>
        </div>

        <div className="services-grid">

          {services.map((service) => (
            <div
              className="service-card"
              key={service.id}
            >

              <div className="service-icon">
                {service.icon}
              </div>

              <h3>{service.title}</h3>

              <p>
                {service.description}
              </p>

              <button
                onClick={() => handleServiceSelect(service)}
              >
                Select
              </button>

            </div>
          ))}

        </div>

      </main>

    </div>
  );
}

export default Services;