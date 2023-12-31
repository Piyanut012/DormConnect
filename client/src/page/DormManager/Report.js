import axios from "axios";
import { Col, Container, Row, Spinner } from "react-bootstrap";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate,  useParams } from "react-router-dom";


import "./Report.css";
import Slidebar from '../../components/SildeBar_Dorm';


const Report = () => {
    const [apiData, setApiData] = useState(false);
    const [loading, setLoading] = useState(true);
    const params = useParams();

    const location = useLocation();

    const fetchData = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_ROOT + "/reports_emp/" + params.id;
        const response = await axios.get(apiUrl);
  
        if (response.status === 200) {
          setApiData(response?.data?.reports);
        }
  
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error.response);
      }
    };
  
    useEffect(() => {
      fetchData();
    }, []);

    //2.form handling and saving
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const saveForm = async (data, id, targetStatus) => {
    setLoading(true);
    const reportId = id;
    if (targetStatus === 'RECEIVED'){
      data.status = 'ONGOING';
    }else if (targetStatus === 'ONGOING'){
      data.status = 'COMPLETED';
    }
    
    try {
      const apiUrl = process.env.REACT_APP_API_ROOT + "/report_update/" + reportId;
      const response = await axios.put(apiUrl, data);

      if (response.status === 200) {
        console.log(response);
        fetchData();
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error.response);
    }
  };

    console.log(apiData);
    
    if (loading) {
      return (
      <>
        <Container className="spinner">
          <Spinner animation="grow"/>
        </Container>
      </>
      );
    }

    return (
      <body>
        <Slidebar/>
        <reportd>
          <div className="py-4">
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Document</title>
          {/* <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" crossOrigin="anonymous" /> */}
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
          {/* Font */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
          <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@300&display=swap" rel="stylesheet" />
          {/* Head */}
          <div className="container">
            <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
              <div className="col-md-3 mb-2 mb-md-0">
                <a href="/" className="d-inline-flex link-body-emphasis text-decoration-none">
                  <svg className="bi" width={40} height={32} role="img" aria-label="Bootstrap"><use xlinkHref="#bootstrap" /></svg>
                </a>
              </div>
              <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
                <li><a href="#" className="nav-link px-2">ปัญหา</a></li>
              </ul>
              <div className="col-md-3 text-end">
                {/* <button type="button" class="btn btn-outline-primary me-2">Login</button>
          <button type="button" class="btn btn-primary">Sign-up</button> */}
              </div>
            </header>
          </div>
          <div className="container px-4 py-5" id="hanging-icons">
            {/* <h2 class="pb-2 border-bottom">Hanging icons</h2> */}
            <div className="row g-4 py-5 row-cols-1 row-cols-lg-3">
              {/* reports */}
              {apiData && 
                apiData.map((reports, index) => {
                if (reports.status !== "COMPLETED") {
                  return (
                    <Col
                      id={`report_${reports.room_id}`}
                      className={`col d-flex align-items-start report ${reports.status === 'ONGOING' ? 'status-ongoing' 
                      : reports.status === 'RECEIVED' ? 'status-received' : ''}`}
                      key={index}
                    >
                      <div className="icon-square text-body-emphasis bg-body-secondary d-inline-flex align-items-center justify-content-center fs-4 flex-shrink-0 me-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" fill="currentColor" class="bi bi-exclamation-square seticon" viewBox="0 0 16 16">
                        <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                        <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
                      </svg>
                      </div>
                      <Col>
                        <h3 className="fs-2 text-body-emphasis">{reports.room_id}</h3>
                        <p>{reports.description}</p>
                      </Col>
                      <form onSubmit={handleSubmit(data => saveForm(data, reports.report_id, reports.status))} >
                        <Col className="col-md-3 text-end">
                          {reports.status === 'RECEIVED' && (
                          <button type="submit" className="btn btn-outline-primary me-2" >ดำเนินการ</button>
                          )}  
                          {reports.status === 'ONGOING' && (
                          <button type="submit" className="btn btn-outline-primary me-2" >เสร็จสิ้น</button>
                          )}                       
                        </Col>
                      </form>
                    </Col>
                  );
                }
                return null; // Return null for report cards with status "COMPLETED" to hide them
              })
            }
            </div>
          </div>
          </div>
        </reportd>
      </body>
    );
    }

export default Report;
