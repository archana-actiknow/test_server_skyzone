const Popup = (props) => {
    const { 
      title, 
      children, 
      trigger, 
      togglePopup, 
      handleSubmit, 
      closeRef, 
      popup_id = false, 
      openRef,
      closeEdit = false
    } = props;
    const popupId = (popup_id) ? popup_id : title.toLowerCase().replace(/\s+/g, '-');
    return (
      <>
        {trigger ?
        <button className="ss_btn" data-toggle="modal" data-target={`#${popupId}`} onClick={togglePopup}>
          {trigger}
        </button>
        :
        <span data-toggle="modal" data-target={`#${popupId}`} onClick={togglePopup} ref={openRef}></span>
        }
  
          <div className="modal fade" id={popupId} tabIndex="-1" role="dialog" aria-labelledby="modalLabel" data-backdrop="static" >
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">

              <form className="p-4row group-panel add-user" onSubmit={handleSubmit} method="post">
        
              <div className="modal-header">
                <h4 className="modal-title" id="modalLabel">{title}</h4>
                <button type="button" className="btn-close" data-dismiss="modal" aria-label="Close" onClick={() => closeEdit? closeEdit(false):null} />			
              </div>

              <div className="modal-body no-padding">
                {children}
              </div>

              <div className="modal-footer">
                <button type="button" ref={closeRef} className="refreshbtn" data-dismiss="modal" aria-label="Close" onClick={() => closeEdit? closeEdit(false):null}>Cancel</button>
                <button type="submit" className="ss_btn" id="adduser_btn">Submit</button>				
              </div>

              </form>

            </div>
          </div>
        </div>
      </>
    );
  };
  
  export default Popup;
  