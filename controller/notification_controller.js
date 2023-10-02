const admin = require("firebase-admin");
admin.initializeApp({
    credential: admin.credential.cert({
            "type": "service_account",
            "project_id": "babershopotp",
            "private_key_id": "a21d7466c3ff40102efecffb7d9cefc7acdbbb80",
            "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDtqEKpHXZoBt/E\nm+2s2i3WQlFYZcZiI5iRA1KNrAdi4y37K92UtzGhO4KKj968Fgh303Mdje8v5v5R\nKYHirioYmNl31M6dDwpnPMVgLedoFX+6ERQik2D625540XCd2b3hTVxa8+lGu087\nOJY4oZIDsOzR63mZ3Hbrvbrv9tmr4jqQlx/3i52w42sGL+JhjtPjWLKBbWCzU3yz\nFEgE19hzByZKK09VZOe8SGj2SbNzWU7KdWJG17KgnLmW0t31MoNFQPkf2zZBmmKx\nZTcLQmVbYB74qwz0kIwONS6HQTNb7gKwrY3Dwo3zK4WLp2Nvy+FnMJHh2NIrVDr7\nPkXYguPxAgMBAAECggEACuTPTW/SzIwht+7xczg7D3SE99lBqAaVFaY1cG+l+22J\n3yOqUAjuGioF3vK4u7fQCPVLdEIPaHHQglYcCvdMNn1tkBvt1Qg3KpCAEahF0Id8\njkH+Wy/IEcFKBdeMr64NkXIAEKrYLH+LvB2Cnhm8SjWf3WcYV11Iop/ug9Wb/unU\ns3205P2cb98PuZN6cRLiys/Y0ZvHzxdz97LmwFBaoxVifE8sNKbh8RdSPD8q6nO3\nEaV+tIcyTuco4vNGM3miJlwGmI0AugjFacPPFIXgu5jSqQW2zEF1WjwOza9uP2Dv\nmhiYJFYzMqDiEQ7coJxWI8LBiGmTOEUzANwBJmhBowKBgQD/eYG+85RXbe6KaIua\n+mVLHVD4KpEBS6QKPhGS7oGze9/OKm3zQ/z0XgIO3XtEL7wETOlRXiGGYuvo4bhi\nmF9XRFnD+FToH/Rsq2Iwb76r50TDGRVr7iRRorg7BJUo7cgQkAvseagbnx5UUsgD\nqlgybO2mJ/m2QrxgRiru8GVvMwKBgQDuJV+sGa2/OngWDVXPSQ2CZBh6mdMF3Ivl\n6bnrXE7Acu3pI1bilKqmg265toRZqyIbs3vlYNd49AguNN9YdByZ5CuL/gy4PYXd\nQ9FXLWRx8RKaK+yIDPRALDAot1d3/ihZv5qP9CZmSxRvpgZAVCADZvS1lPr/bNtO\nQ9JYAUdwSwKBgG8DH6wYMDeln2gpcbCQaf+v54VPCd+kPM3ulrhgR5/0jhYKPejd\nfEe7qe1HtM62Z17/BMvEuZCp35U8sGC3kYZcPx13BX4wlIe8GViu1g3g2vJkLfjO\nbJ3EtYV/wkkcujjoPyYs3y3RgN5ncl6VYOnYh5QR/uKCMVUsaG+XqpwdAoGACt1t\npf5t7OGQBQGKvrBIi4BhlYZbGFNdlpm5P8GwXhtgO1i/aAr8Vih87sAi/axPHBBu\nQKLQcdZAYUtMPU7e1y6Pxg1LK0SzTMsBTAboJEKpZJtIaVSd+CeL8u+acAEKej3B\noXu0HMqkHgvnERxFcaJK29X2NZ0TzFhPynAUgE0CgYBeRFGNS8xkZU301bZtpns3\nT92K1JB/OECYBmVStT+eVrUglDXEyN5sd8GXfxrV+X1SawDe61wojBgUry/d1KXG\nvk2PPP+FlwoZhv+JK4LD/ta0bPIQY/LgbuXg2clMBRebNAA0QWMJkDJzNMVwo01T\nYUnn/SmIujmD5vQ4X0xASw==\n-----END PRIVATE KEY-----\n",
            "client_email": "firebase-adminsdk-uimec@babershopotp.iam.gserviceaccount.com",
            "client_id": "105539013597782392665",
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-uimec%40babershopotp.iam.gserviceaccount.com"
        }
    )
});
admin.firestore()
exports.pushNotification = async (topicId, title, body = {}) => {
    const message = {
        notification: {
            title: title,
            body: body,
        },
        topic: topicId,
    }
    admin
        .messaging()
        .send(message)
        .then(async (response) => {
            console.log("Successfully sent message:", response)
        })
        .catch((error) => {
            console.log("Error sending message:", error)
        })
}
