"""
{
  "paths": {
    "/api/user": {
      "get": {
        "summary": "Get User Info",
        "responses": {
          "200": {
            "description": "User information retrieved successfully"
          }
        }
      }
    }
  }
}
"""
def get_user():
    return "User Info"
