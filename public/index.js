angular
	.module( 'a', ['ngRoute'] )
	.config($routeProvider => {
		$routeProvider
		.when('/ujnyulhtml', { 
			templateUrl : "/backend/ujnyulhtml" })
		.when('/ujketrechtml', { 
			templateUrl : "/backend/ujketrechtml" })
		.when('/mainhtml', { 
			templateUrl : "/backend/mainhtml" })
		.when('/sugohtml', { 
			templateUrl : "/backend/sugohtml" })
	})
	.controller( 'c', ($scope,$http,$interval)=>{
		$scope.nyulak = [] //megjelenített nyulak
		$scope.ketrecek = [] //megjelenített ketrecek
		$scope.nyul = {} //nyúl objektum létrehozása
		$scope.ketrec = {} //ketrec objektum létrehozása
		$scope.nyul_nyulszam_hiba=false
		$scope.ketrec_ketrecszam_hiba=false
		
		
		$scope.nyulkuld = () => {
			console.log($scope.nyul)
			$http
				.post("nyulment", $scope.nyul)
				.then (resp=>{
					$scope.nyul_nyulszam_hiba=false
					if (resp.data.ok==1) $scope.nyul={}
					if (resp.data.ok==0) $scope.nyul_nyulszam_hiba=true
					$scope.nyulfrissit();
				})
		}
		$scope.ketreckuld = () => {
			console.log($scope.ketrec)
			$http
				.post("ketrecment", $scope.ketrec)
				.then (resp=>{
					console.log(resp.data)
					$scope.ketrec_ketrecszam_hiba=false
					if (resp.data.ok==1) $scope.ketrec={}
					if (resp.data.ok==0) $scope.ketrec_ketrecszam_hiba=true
					$scope.ketrecfrissit();
				})
		}
		$scope.mindetmutat = () => {
			$scope.nyul={}
			$http 
				.post("keres", {mitkeres:""})
                .then( res => {
					console.log(res.data)
					$scope.ketrecek = res.data
				 })
		}
		
		$scope.mindetmutat()

		$scope.ketrecfrissit = () => {
			$http
				.get("ketrecek")
                .then( res => {
					console.log(res.data)
					$scope.ketrecek = res.data
				 })
		}
		
		$scope.ketrecfrissit()
		
		$scope.nyulfrissit = () => {
			$http
				.get("nyulak")
                .then( res => {
					console.log(res.data)
					$scope.nyulak = res.data
				 })
		}
		
		$scope.nyulfrissit()
				
		$scope.keres = () => {
			$http
				.post("keres",{mitkeres: $scope.keresomezo})
				.then( res => {
					$scope.nyulak=res.data.nyulak
					console.log($scope.nyulak)
				})
		}
		$interval( () => {
			pontosido = new Date()
            $scope.time = pontosido
		})
		
	})