// Simple library contract to set the time
contract LibraryContract {

    // stores a timestamp
    uint storedTime;

    function setTime(uint _time) public {
        storedTime = _time;
    }
}
