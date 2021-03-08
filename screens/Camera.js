import React from 'react';
import {View, Button, Platform} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

export default class PickImage extends React.Component{
    state = {
        image : null
    }

    getPermssions = async () => {
        if (Platform.OS != 'web'){
            const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL)

            if(status != 'granted'){
                alert('Sorry, We Need Camera Permissions To Make This App Work');
            }
        }
    }

    componentDidMount(){
        this.getPermssions()
    }

    uploadImage = async (uri) => {
        const data = new FormData()
        var fileName = uri.split('/')[uri.split('/').length - 1]
        var type = `image / ${uri.split('.')[uri.split('.').length - 1]}`
        const filesToUpload = {uri:uri, name: fileName, type:type}
        data.append('digit', filesToUpload);
        fetch('http://9be2bec86256.ngrok.io/predict-digit', {
            method : 'POST',
            body: data,
            headers: {'content-type':'multipart/form-data'}
        })
    }

    pickImage = async () => {
        try{
            var result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: false,
                aspect: [4, 3],
                quality: 1
            })

            if(!result.cancelled){
                this.setState({
                    image: result.data
                })

                this.uploadImage(result.uri)
            }
        }
        catch(e){
            console.log(e)
        }
    }

    render(){

        var {image} = this.state;

        return(
            <View style={{marginTop: 100}}>
                <Button title = 'Pick An Image' onPress = {this.pickImage}  /> 
            </View>
        )
    }

}