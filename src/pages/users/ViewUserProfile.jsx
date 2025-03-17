import React, { useState } from 'react'
import { IsRoleSuperAdmin, timezones, user_roles } from '../../utils/Common';
import PopupModal from '../../components/PopupModal';

export default function ViewUserProfile({close, data}) {
    
    // OPEN CLOSE MODAL 
    const [open, setOpen] = useState(true);

    const handleClose = () => {
        setOpen(false)
        close(false)
    }

    const userTimezone = timezones.find(timezone => (timezone.id === data?.timezone))
    const userRole = user_roles.find(role => (role.value === data?.role))
    const superAdminRole = IsRoleSuperAdmin(data?.role);
    
  return (
        <PopupModal title="View Profile" open={open} setOpen={handleClose} size='md' footer={false}>
            <div className="col-sm-12" id="dis_list"> 
                <div className="form-group row">

                    <div className="col-sm-12">
                        <label className="fs-12 fw-semibold">Username</label>
                        <span className='mt-0 mb-3 fs-13 form-control border-none length_count'><i className="bi bi-person-circle"></i> {data.username}</span>
                        <hr className='mt-0 mb-0'/>
                    </div>

                    <div className="col-sm-12">
                        <label className="fs-12 fw-semibold">Name</label>
                        <span className='mt-0 mb-3 fs-13 form-control border-none length_count'><i className="bi bi-person"></i> {data.name}</span>
                        <hr className='mt-0 mb-0'/>
                    </div>

                    <div className="col-sm-12">
                        <label className="fs-12 fw-semibold">Email</label>                        
                        <span className='mt-0 mb-3 fs-13 form-control border-none length_count'><i className="bi bi-envelope"></i> {data.email}</span>
                        <hr className='mt-0 mb-0'/>
                    </div>

                    <div className="col-sm-12">
                        <label className="fs-12 fw-semibold">Contact</label>
                        <span className='mt-0 mb-3 fs-13 form-control border-none length_count'><i className="bi bi-phone"></i> {data.contact}</span>
                        <hr className='mt-0 mb-0'/>
                    </div> 

                    <div className="col-sm-12">
                        <label className="fs-12 fw-semibold">TimeZone</label>
                        <span className='mt-0 mb-3 fs-13 form-control border-none length_count'><i className="bi bi-clock"></i> {userTimezone?.label}</span>
                        <hr className='mt-0 mb-0'/>
                    </div>

                    <div className="col-sm-12">
                        <label className="fs-12 fw-semibold">Role</label>
                        <span className='mt-0 mb-3 fs-13 form-control border-none length_count'><i className="bi bi-person-badge"></i> {userRole?.label}</span>
                        <hr className='mt-0 mb-0'/>
                    </div>  

                    <div className="col-sm-12">
                      <label className="fs-12 fw-semibold">Locations</label>
                        {(superAdminRole) ?
                            <span className='mt-0 mb-3 fs-13 form-control border-none length_count'><i className="bi bi-person-badge"></i> All Locations</span>
                            :
                            <>
                            {data.location.map((location, index) => (
                                <span key={index} className='mt-0 mb-0 fs-13 form-control border-none length_count'><i className="bi bi-geo-alt"></i> {location}</span>
                            ))}
                            </>
                        }
                    </div>

                </div>
            </div>
        </PopupModal>
  )
}
