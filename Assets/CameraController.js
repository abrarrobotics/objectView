#pragma strict

var mes: String;

function Awake () {
	Screen.sleepTimeout = SleepTimeout.NeverSleep;
}

function Start () {
	if (Application.platform == RuntimePlatform.Android) {
		Input.gyro.enabled = true;
	}
	GetLocation();
	StartCoroutine(Loop());
}

function Update () {
	if (Application.platform == RuntimePlatform.Android) {
		var gyro: Quaternion = Input.gyro.attitude;
		this.transform.localRotation = Quaternion.Euler(90, 0, 0) * (new Quaternion(-gyro.x, -gyro.y, gyro.z, gyro.w));
	}
	else if (Application.platform == RuntimePlatform.OSXEditor) {
		if (Input.GetKey(KeyCode.UpArrow)) {
			this.transform.Rotate(Vector3.right, -1);
		}
		if (Input.GetKey(KeyCode.DownArrow)) {
			this.transform.Rotate(Vector3.right, 1);
		}
		if (Input.GetKey(KeyCode.LeftArrow)) {
			this.transform.Rotate(Vector3.up, -1, Space.World);
		}
		if (Input.GetKey(KeyCode.RightArrow)) {
			this.transform.Rotate(Vector3.up, 1, Space.World);
		}
		if (Input.GetKey(KeyCode.Space)) {
			this.transform.rotation = Quaternion.Euler(0, 0, 0);
		}
	}
}

function OnGUI () {
	// テキストフィールドを表示する
	GUI.TextField(Rect(10, 10, 500, 20), mes);
}

function GetLocation () {

	var longitude: double;
	var latitude: double;
	var done: boolean = false;

	// First, check if user has location service enabled
	if (!Input.location.isEnabledByUser) {
		print ("Input.location disabled");
		return;
	}

	// Start service before querying location
	Input.location.Start ();

	// Wait until service initializes
	var maxWait : int = 60;
	while (Input.location.status == LocationServiceStatus.Initializing && maxWait > 0) {
		yield WaitForSeconds (1);
		maxWait--;
	}
	// Service didn't initialize in maxWait seconds
	if (maxWait < 1) {
		print ("Timed out");
		return;
	}

	// Connection has failed
	if (Input.location.status == LocationServiceStatus.Failed) {
		print ("Unable to determine device location");
		return;
	}
	// Access granted and location value could be retrieved
	else {
		longitude = Input.location.lastData.longitude;
		latitude = Input.location.lastData.latitude;
		done = true;
		print("LLLLL: " + longitude + ", " + latitude);
	}

	// Stop service if there is no need to query location updates continuously
//	Input.location.Stop ();
}

function Loop () {
	while (true) {
		yield WaitForSeconds(1);
		mes = "<size=30>LAT:" + Input.location.lastData.latitude + ", LNG:" + Input.location.lastData.longitude + "</size>";	
		var sysInfo: UnityEngine.UI.Text = GameObject.Find("/Canvas/Text").GetComponent("Text") as UnityEngine.UI.Text;
		sysInfo.text = mes;
	}
}