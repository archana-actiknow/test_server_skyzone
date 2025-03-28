import React, { useState , useEffect} from 'react' 


export default function Accordion({id, title, children, actionTitle, actionValue, handleAction, infoTitle, addClass, defaultCollapse = false,statusColor,open}) {
    // const [collapsed, setCollapsed] = useState(defaultCollapse);
    const [collapsed, setCollapsed] = useState((open ?? false));

    const toggleCollapse = () => { setCollapsed(!collapsed);}
    useEffect(() => {
        if (open) {
            setCollapsed(true);
        }
    }, [open]);


    return ( 
        <div className={`accordion ${addClass}`}>
            <div className="accordion-item card">
                {(actionTitle !== undefined && actionTitle !== null) &&
                <div className="d-flex">
                    <button className="accordionSpan" value={actionValue ? actionValue : ''} onClick={handleAction}>
                        {actionTitle}
                    </button>
                </div>
                }
                <h2 className="accordion-header d-flex align-items-center">
                    <button type="button" className={`accordion-button${collapsed ? '' : ' collapsed'}`} data-bs-toggle="collapse" data-bs-target={`accordionWithIcon-${id}`} aria-expanded={collapsed} onClick={toggleCollapse}>
                        <i className="bx bx-bar-chart-alt-2 me-2"></i>
                            {statusColor !== undefined ? 
                            <div className="fs-13 fw-semibold mb-0">
                                <div className="fw-semibold d-flex align-items-center">
                                    {statusColor && <span className={`p-1 rounded-circle ${statusColor}`}></span>}
                                    <span className="ms-1">{title}</span>
                                </div>
                            </div>
                            :
                            <p className="fs-13 fw-semibold mb-0">{title}</p>
                            }
                    </button>
                    {(infoTitle !== undefined && infoTitle !== null) &&
                    <div className="d-flex">
                        <span className="accordionSpan">
                            {infoTitle}
                        </span>
                    </div>
                    }
                </h2>
                <div id={`accordionWithIcon-${id}`} className={`accordion-collapse collapse${collapsed ? ' show' : ''}`}>
                    <div className="accordion-body">
                        <div className="table-responsive text-nowrap">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
  )
}