<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Symfony\Component\HttpFoundation\Response;

class BaseAPIController extends Controller
{
    protected $status_code = Response::HTTP_OK;
    
    public function setStatusCode($code)
    {
        $this->status_code = $code;
        return $this;
    }
    
    protected function getStatusCode()
    {
        return $this->status_code;
    }
    
    public function respond($data, $headers = [])
    {
        return response()->json($data, $this->getStatusCode(), $headers);
    }
    
    public function respondWithError($message)
    {
        return $this->respond(['error' => $message]);
    }
    
    public function respondBadRequest($message = "Bad Request.")
    {
        return $this->setStatusCode(Response::HTTP_BAD_REQUEST)
            ->respondWithError($message);
    }
    
    public function respondNotAuthorized($message = "Unauthorized Access.")
    {
        return $this->setStatusCode(Response::HTTP_UNAUTHORIZED)
            ->respondWithError($message);
    }
    
    public function respondForbidden($message = "Forbidden.")
    {
        return $this->setStatusCode(Response::HTTP_FORBIDDEN)
            ->respondWithError($message);
    }
    
    public function respondNotFound($message = "Not Found.")
    {
        return $this->setStatusCode(Response::HTTP_NOT_FOUND)
            ->respondWithError($message);
    }
    
    public function respondUnprocessable($message = "Unprocessable Entity.")
    {
        return $this->setStatusCode(Response::HTTP_UNPROCESSABLE_ENTITY)
            ->respondWithError($message);
    }
}
