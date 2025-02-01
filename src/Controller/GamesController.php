<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class GamesController extends AbstractController
{
    #[Route('/games', name: 'app_games')]
    public function index(): Response
    {
        return $this->render('app/games/index.html.twig', [
            'controller_name' => 'GamesController',
        ]);
    }
}
