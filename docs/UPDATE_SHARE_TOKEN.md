이 프로젝트에 task/detail 페이지는 id 파라미터를 사용하고있습니다
신규기능으로 share/{token} 을 받게되면

GET /api/v1/share/task/{shareToken}

으로 받아온 task 상세정보를 볼수 있도록 할것입니다.

POST /api/v1/task/{taskId}/share

task/detail 이나 공유하기 관련 버튼이 있는곳은 위 API로 share token을 발급받습니다
