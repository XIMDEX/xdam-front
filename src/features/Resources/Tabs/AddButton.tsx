import { Button as Btn,Icon } from "semantic-ui-react";
const AddButton = (props) => {
    const textBoxStyle = {"padding":"1rem","borderWidth":"2px","borderColor":"#43a1a2","width":"100%","textAlign":"justify","boxShadow":"0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"}
    return (
        <div style={{"padding":"1rem","display":"flex","flexDirection":"column","flexWrap":"wrap","justifyContent":"center","gap":"1rem"}} >
            <textarea style={textBoxStyle}>{props.text}</textarea>
            <Btn
                color="teal"
                icon="facebook"
                //  onClick={}
                //loading={processing}
            >
                <>
                    <Icon name="save" /> Add
                </>
            </Btn>
        </div>
    );
};

export default AddButton;
